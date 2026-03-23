import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Mail, Phone, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCompanyMembers, inviteMember } from '../services/api';
import InviteMemberModal from '../components/InviteMemberModal';

const Team = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await getCompanyMembers(token);
            const company = response.data;
            
            // Combine users and pending invites
            const activeUsers = (company.users || []).map(u => ({
                id: u.id,
                name: u.name,
                role: u.role,
                email: u.email,
                status: 'Active',
                avatar: u.name ? u.name.charAt(0).toUpperCase() : '?'
            }));

            const pendingInvites = (company.invites || []).filter(i => i.status === 'PENDING').map(i => ({
                id: `invite-${i.id}`,
                name: 'Pending Invite',
                role: i.role,
                email: i.email,
                status: 'Invite Sent',
                avatar: '✉'
            }));

            setMembers([...activeUsers, ...pendingInvites]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInviteSubmit = async (inviteData) => {
        try {
            setIsSubmitting(true);
            await inviteMember(token, inviteData);
            setIsModalOpen(false);
            fetchMembers(); // refresh
        } catch (err) {
            alert(err.message || 'Failed to send invite');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredMembers = members.filter(m => 
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your team and their access permissions.</p>
                </div>

                {user?.role === 'ADMIN' && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm w-full sm:w-auto"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                    </button>
                )}
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="font-semibold text-gray-700">All Members ({filteredMembers.length})</h2>
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search team..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading team members...</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredMembers.map((member) => (
                            <div key={member.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {member.avatar}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {member.email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                    member.role === 'ACCOUNTANT' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {member.role === 'ADMIN' ? 'Admin' : member.role === 'ACCOUNTANT' ? 'Accountant' : member.role === 'EMPLOYEE' ? 'Employee' : member.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                        }`}>
                                        {member.status}
                                    </span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <InviteMemberModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleInviteSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default Team;
